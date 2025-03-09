
import React from "react";
import { useQueue } from "@/contexts/QueueContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ListPlus, UserMinus, Users, Clock, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const QueueDashboard = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const { 
    queueItems,
    queueLength, 
    userPosition, 
    isInQueue, 
    joinQueue, 
    leaveQueue, 
    isLoading: queueLoading,
    selectedQueueType,
    setSelectedQueueType
  } = useQueue();

  const isLoading = authLoading || queueLoading;

  if (!currentUser) {
    return (
      <Card className="w-full md:max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-queue-dark">Queue Access</CardTitle>
          <CardDescription className="text-center">
            Please sign in to join the queue
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <AlertCircle className="h-24 w-24 text-queue-accent animate-pulse-gentle" />
        </CardContent>
      </Card>
    );
  }

  const handleJoinQueue = (queueId: string) => {
    joinQueue(queueId);
  };

  return (
    <Card className="w-full md:max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-queue-dark">
          Queue Status
        </CardTitle>
        <CardDescription className="text-center">
          Select a queue to join or view its status
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </>
        ) : (
          <>
            <Tabs 
              defaultValue={selectedQueueType} 
              value={selectedQueueType}
              onValueChange={setSelectedQueueType}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                {queueItems.slice(0, 2).map(item => (
                  <TabsTrigger key={item.id} value={item.id} className="relative">
                    {item.name}
                    {item.userCount > 0 && (
                      <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                        {item.userCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsList className="grid grid-cols-2">
                {queueItems.slice(2, 4).map(item => (
                  <TabsTrigger key={item.id} value={item.id} className="relative">
                    {item.name}
                    {item.userCount > 0 && (
                      <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                        {item.userCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {queueItems.map(item => (
                <TabsContent key={item.id} value={item.id} className="mt-4">
                  <div className="space-y-4">
                    <div className="text-sm text-gray-500">{item.description}</div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center p-4 bg-queue-light rounded-lg">
                        <Users className="h-8 w-8 mb-2 text-queue-primary" />
                        <p className="text-sm text-gray-500">Total In Queue</p>
                        <p className="text-3xl font-bold text-queue-dark">{item.userCount}</p>
                      </div>
                      
                      <div className="flex flex-col items-center p-4 bg-queue-light rounded-lg">
                        <Clock className="h-8 w-8 mb-2 text-queue-accent" />
                        <p className="text-sm text-gray-500">Your Position</p>
                        <p className="text-3xl font-bold text-queue-dark">
                          {isInQueue && selectedQueueType === item.id ? userPosition : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-queue-light rounded-lg p-4">
                      <h3 className="font-medium mb-2">Status</h3>
                      <p>
                        {isInQueue && selectedQueueType === item.id
                          ? `You are currently in the ${item.name} queue at position ${userPosition}.` 
                          : `You are not currently in the ${item.name} queue.`}
                      </p>
                    </div>

                    {isInQueue && selectedQueueType === item.id ? (
                      <Button
                        className="w-full flex items-center justify-center gap-2 bg-queue-danger hover:bg-queue-danger/90"
                        onClick={leaveQueue}
                        disabled={isLoading}
                      >
                        <UserMinus className="h-5 w-5" />
                        Exit Queue
                      </Button>
                    ) : (
                      <Button
                        className="w-full flex items-center justify-center gap-2 bg-queue-secondary hover:bg-queue-secondary/90"
                        onClick={() => handleJoinQueue(item.id)}
                        disabled={isLoading}
                      >
                        <ListPlus className="h-5 w-5" />
                        Join Queue
                      </Button>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QueueDashboard;
