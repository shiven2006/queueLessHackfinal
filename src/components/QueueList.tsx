
import React from "react";
import { useQueue } from "@/contexts/QueueContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const QueueList = () => {
  const { queueUsers, queueItems, isLoading, selectedQueueType, setSelectedQueueType } = useQueue();

  // Filter users by queue type
  const filteredUsers = queueUsers.filter(user => user.queueType === selectedQueueType);

  return (
    <Card className="w-full md:max-w-3xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-queue-dark">Current Queues</CardTitle>
            <CardDescription>
              {filteredUsers.length > 0 
                ? `${filteredUsers.length} people waiting in ${queueItems.find(item => item.id === selectedQueueType)?.name || "queue"}` 
                : `No one is currently in the ${queueItems.find(item => item.id === selectedQueueType)?.name || "queue"}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue={selectedQueueType} 
          value={selectedQueueType}
          onValueChange={setSelectedQueueType}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            {queueItems.map(item => (
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
            <TabsContent key={item.id} value={item.id}>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 py-3">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-queue-primary/10 text-queue-primary font-medium">
                        {user.position}
                      </div>
                      <Avatar className="h-10 w-10 border border-queue-light">
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{user.userName}</p>
                        <p className="text-sm text-gray-500">{user.userEmail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>The queue is currently empty</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QueueList;
