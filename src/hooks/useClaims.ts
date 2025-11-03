import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Claim, SchemeType, ClaimStatus } from '@/types/plant';

export const useClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();

  useEffect(() => {
    if (!user) {
      setClaims([]);
      setLoading(false);
      return;
    }

    let q;
    if (userRole === 'authority') {
      // Authority sees all claims
      q = query(
        collection(db, 'claims'),
        orderBy('submittedAt', 'desc')
      );
    } else {
      // Farmers see only their claims
      q = query(
        collection(db, 'claims'),
        where('farmerId', '==', user.uid),
        orderBy('submittedAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const claimsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Claim[];
      setClaims(claimsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userRole]);

  const submitClaim = async (
    plantId: string,
    plantName: string,
    schemeType: SchemeType,
    claimAmount: number
  ) => {
    if (!user) {
      throw new Error("You must be logged in to submit claims");
    }
    
    try {
      const claimData = {
        plantId,
        farmerId: user.uid,
        farmerName: user.email || 'Unknown Farmer',
        schemeType,
        claimAmount,
        approvalStatus: 'pending' as ClaimStatus,
        submittedAt: Date.now(),
        plantName,
        createdAt: Timestamp.now()
      };
      
      await addDoc(collection(db, 'claims'), claimData);
    } catch (error) {
      console.error("Firebase error:", error);
      throw error;
    }
  };

  const processClaim = async (
    claimId: string, 
    status: ClaimStatus, 
    remarks: string
  ) => {
    if (!user || userRole !== 'authority') {
      throw new Error("Only authorities can process claims");
    }

    const claimRef = doc(db, 'claims', claimId);
    await updateDoc(claimRef, { 
      approvalStatus: status,
      remarks,
      verifierId: user.uid,
      processedAt: Date.now(),
      updatedAt: Timestamp.now()
    });
  };

  return {
    claims,
    loading,
    submitClaim,
    processClaim
  };
};
