import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { formatIndianNumber } from '@/lib/utils';

interface PartToOrder {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  job_card_id: string;
  job_card?: {
    customer_name: string;
    car_make: string;
    car_model: string;
  };
  status?: string;
}

const PartsToOrder = () => {
  const [parts, setParts] = useState<PartToOrder[]>([]);
  const [lastDebug, setLastDebug] = useState<any>(null); // DEV only
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchPartsToOrder();

    const channel = supabase
      .channel('job_cards-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_cards' },
        () => {
          fetchPartsToOrder();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPartsToOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: jobCards, error: jobCardsError } = await supabase
        .from('job_cards')
        .select(`
          id,
          customer_name,
          car_make,
          car_model,
          parts,
          status
        `)
        .or('status.eq.Pending,status.eq.In Progress,status.eq.Parts Ordered')
        .not('parts', 'is', null);

      if (jobCardsError) throw jobCardsError;

      const partsToOrder: PartToOrder[] = [];
      let totalConsidered = 0;
      let debugData: any[] = []; // DEV: collect for debugging

      jobCards?.forEach(jobCard => {
        // Defensive: parts can be null, undefined, or empty
        const partsArray = Array.isArray(jobCard.parts) ? jobCard.parts : [];
        partsArray.forEach((part: any, partIdx: number) => {
          totalConsidered++;
          // collect for DEV debug section
          debugData.push({
            job_card_id: jobCard.id,
            job_card_status: jobCard.status,
            part
          });
          // Use robust true check for addedToPurchaseList
          const addedToPurchaseList =
            part.addedToPurchaseList === true ||
            part.addedToPurchaseList === 1 ||
            part.addedToPurchaseList === "true";

          // Treat zero, "0", null as false
          const inStock = part.inStock === true || part.inStock === 1 || part.inStock === "true";

          const inventoryId = part.inventoryId ?? "";
          const isCustomOrNotInInventory = (!inventoryId || inventoryId === "custom");

          const needsToOrder =
            !!addedToPurchaseList &&
            (!inStock) &&
            isCustomOrNotInInventory;

          if (needsToOrder) {
            partsToOrder.push({
              id: `${jobCard.id}-${part.name || partIdx}`,
              name: part.name,
              quantity: part.quantity,
              unitPrice: part.unitPrice,
              job_card_id: jobCard.id,
              job_card: {
                customer_name: jobCard.customer_name,
                car_make: jobCard.car_make,
                car_model: jobCard.car_model
              },
              status: part.orderStatus || 'Pending'
            });
          }
        });
      });

      if (import.meta.env.DEV) {
        setLastDebug({
          totalConsidered,
          partsToOrderCount: partsToOrder.length,
          jobCards,
          debugParts: debugData
        });
        console.log('[PartsToOrder DEBUG]', {
          totalConsidered,
          found: partsToOrder.length,
          partsToOrder,
          allParts: debugData
        });
      }

      partsToOrder.sort((a, b) => a.name.localeCompare(b.name));
      setParts(partsToOrder);
    } catch (err) {
      console.error('PartsToOrder: Error fetching parts to order:', err);
      setError('Failed to load parts data');
      toast({
        title: "Error",
        description: "Could not load parts to order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToInventory = () => {
    navigate('/inventory?filter=to-order');
  };

  const viewJobCard = (jobCardId: string) => {
    navigate(`/job-cards/edit?id=${jobCardId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Parts to Order
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-center py-6">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Parts to Order
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <p className="text-muted-foreground">Error loading data</p>
          <Button 
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={fetchPartsToOrder}
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Parts to Order
        </CardTitle>
        <CardDescription>
          Custom parts needed that are not in inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {parts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No parts to order</p>
            {import.meta.env.DEV && (
              <div className="text-xs text-gray-400 mt-2 text-left">
                <div><b>DEV MODE</b>: Considered <b>{lastDebug?.totalConsidered}</b> parts across <b>{lastDebug?.jobCards?.length||0}</b> job cards. Found <b>{lastDebug?.partsToOrderCount}</b> that need to be ordered.</div>
                <details className="mt-2 cursor-pointer whitespace-pre-wrap">
                  <summary className="underline">Show job cards/part details (for debugging)</summary>
                  <pre style={{whiteSpace: 'pre-wrap', fontSize: 10}}>
                    {JSON.stringify(lastDebug?.debugParts, null, 2)}
                  </pre>
                </details>
                <div className="mt-2">
                  <div>Checklist for part appearing: </div>
                  <ul className="list-disc ml-6 mt-1">
                    <li>Job card status: <b>Pending/In Progress/Parts Ordered</b></li>
                    <li>Part field <b>addedToPurchaseList</b> is <b>true</b> (boolean, 1, or "true")</li>
                    <li>Part field <b>inStock</b> is <b>false</b> (false, 0, or "false", or missing)</li>
                    <li>Part <b>inventoryId</b> is <b>empty</b>, <b>missing</b>, or <b>custom</b></li>
                  </ul>
                  <div className="font-bold mt-2">If your part isn't showing, check its fields in the job card's parts array above.</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ul className="space-y-2 max-h-[240px] overflow-auto">
            {parts.map((part) => (
              <li 
                key={part.id} 
                className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer"
                onClick={() => viewJobCard(part.job_card_id)}
              >
                <div>
                  <div className="font-medium flex items-center">
                    {part.name}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewJobCard(part.job_card_id);
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {part.job_card?.customer_name} • {part.job_card?.car_make} {part.job_card?.car_model}
                  </div>
                  <div className="text-xs mt-1">
                    <span className="text-muted-foreground">Price:</span> ₹{formatIndianNumber(part.unitPrice, 2)} × {formatIndianNumber(part.quantity, 0)}
                  </div>
                </div>
                <Badge>{formatIndianNumber(part.quantity, 0)} pcs</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {parts.length > 0 && (
        <CardFooter className="pt-4 pb-2">
          <Button 
            variant="secondary" 
            className="w-full text-xs"
            size="sm"
            onClick={goToInventory}
          >
            View in Inventory
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PartsToOrder;
