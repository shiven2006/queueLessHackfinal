
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  where,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface QueueUser {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  joinedAt: any;
  position: number;
  queueType: string;
}

interface QueueItem {
  id: string;
  name: string;
  description: string;
  userCount: number;
}

interface QueueContextType {
  queueUsers: QueueUser[];
  queueItems: QueueItem[];
  userPosition: number | null;
  isInQueue: boolean;
  queueLength: number;
  joinQueue: (queueType: string) => Promise<void>;
  leaveQueue: () => Promise<void>;
  isLoading: boolean;
  selectedQueueType: string;
  setSelectedQueueType: (queueType: string) => void;
}

const QueueContext = createContext<QueueContextType | null>(null);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
};

export const QueueProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [queueUsers, setQueueUsers] = useState<QueueUser[]>([]);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([
    { id: "tech-support", name: "Technical Support", description: "Get help with technical issues", userCount: 0 },
    { id: "customer-service", name: "Customer Service", description: "General customer service inquiries", userCount: 0 },
    { id: "sales", name: "Sales Department", description: "Speak with our sales team", userCount: 0 },
    { id: "returns", name: "Returns and Refunds", description: "Process returns or refunds", userCount: 0 }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQueueType, setSelectedQueueType] = useState("tech-support");
  
  const userPosition = queueUsers.find(user => user.userId === currentUser?.uid && user.queueType === selectedQueueType)?.position || null;
  const isInQueue = userPosition !== null;
  const queueLength = queueUsers.filter(user => user.queueType === selectedQueueType).length;

  useEffect(() => {
    if (!currentUser) {
      setQueueUsers([]);
      setIsLoading(false);
      return;
    }

    const q = query(collection(db, "queue"), orderBy("joinedAt", "asc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users: QueueUser[] = [];
      
      // Fixed the querySnapshot.forEach callback to use proper types
      querySnapshot.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
        const data = docSnapshot.data();
        const queueType = data.queueType || "tech-support"; // Default for backward compatibility
        
        // For each queue type, find all users in that queue and assign positions
        const usersInSameQueue = users.filter(u => u.queueType === queueType);
        const position = usersInSameQueue.length + 1;
        
        users.push({
          id: docSnapshot.id,
          userId: data.userId,
          userName: data.userName,
          userEmail: data.userEmail,
          joinedAt: data.joinedAt,
          position: position,
          queueType: queueType
        });
      });
      
      // Update queue item counts
      const updatedQueueItems = [...queueItems];
      updatedQueueItems.forEach(item => {
        item.userCount = users.filter(user => user.queueType === item.id).length;
      });
      
      setQueueItems(updatedQueueItems);
      setQueueUsers(users);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching queue: ", error);
      toast.error("Failed to load the queue.");
      setIsLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const joinQueue = async (queueType: string) => {
    if (!currentUser) {
      toast.error("You must be signed in to join the queue.");
      return;
    }

    // Check if user is already in the selected queue
    const userInSelectedQueue = queueUsers.find(
      user => user.userId === currentUser.uid && user.queueType === queueType
    );
    
    if (userInSelectedQueue) {
      toast.error("You are already in this queue.");
      return;
    }

    setIsLoading(true);
    try {
      // Check if user is already in queue (double check)
      const existingUserQuery = query(
        collection(db, "queue"), 
        where("userId", "==", currentUser.uid),
        where("queueType", "==", queueType)
      );
      const querySnapshot = await getDocs(existingUserQuery);
      
      if (!querySnapshot.empty) {
        toast.error("You are already in this queue.");
        setIsLoading(false);
        return;
      }

      await addDoc(collection(db, "queue"), {
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous",
        userEmail: currentUser.email,
        joinedAt: serverTimestamp(),
        queueType: queueType
      });
      
      toast.success(`You have joined the ${queueItems.find(q => q.id === queueType)?.name || "queue"}!`);
      setSelectedQueueType(queueType);
    } catch (error) {
      console.error("Error joining queue: ", error);
      toast.error("Failed to join the queue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const leaveQueue = async () => {
    if (!currentUser) {
      toast.error("You must be signed in to leave the queue.");
      return;
    }

    const userQueueEntry = queueUsers.find(
      user => user.userId === currentUser.uid && user.queueType === selectedQueueType
    );
    
    if (!userQueueEntry) {
      toast.error("You are not in this queue.");
      return;
    }

    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "queue", userQueueEntry.id));
      toast.success("You have left the queue.");
    } catch (error) {
      console.error("Error leaving queue: ", error);
      toast.error("Failed to leave the queue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    queueUsers,
    queueItems,
    userPosition,
    isInQueue,
    queueLength,
    joinQueue,
    leaveQueue,
    isLoading,
    selectedQueueType,
    setSelectedQueueType
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};
