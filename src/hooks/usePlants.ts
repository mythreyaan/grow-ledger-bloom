import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Plant } from '@/types/plant';

export const usePlants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();

  useEffect(() => {
    if (!user) {
      setPlants([]);
      setLoading(false);
      return;
    }

    let q;
    if (userRole === 'authority') {
      // Authorities can view all plants
      q = collection(db, 'plants');
    } else {
      // Farmers can only view their own plants
      q = query(
        collection(db, 'plants'),
        where('userId', '==', user.uid)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plantsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Plant[];
      setPlants(plantsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userRole]);

  const addPlant = async (plant: Omit<Plant, 'id'>) => {
    if (!user) {
      throw new Error("You must be logged in to add plants");
    }
    
    try {
      const plantData = {
        name: plant.name,
        species: plant.species,
        plantedDate: plant.plantedDate,
        imageUrl: plant.imageUrl || null,
        currentHeight: plant.currentHeight,
        health: plant.health,
        growthRecords: plant.growthRecords || [],
        genesisHash: plant.genesisHash,
        automaticRecording: plant.automaticRecording || false,
        lastAutomaticRecord: plant.lastAutomaticRecord || null,
        userId: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      await addDoc(collection(db, 'plants'), plantData);
    } catch (error) {
      console.error("Firebase error:", error);
      throw error;
    }
  };

  const updatePlant = async (id: string, updates: Partial<Plant>) => {
    const plantRef = doc(db, 'plants', id);
    await updateDoc(plantRef, { ...updates, updatedAt: Timestamp.now() });
  };

  const deletePlant = async (id: string) => {
    const plantRef = doc(db, 'plants', id);
    await deleteDoc(plantRef);
  };

  return {
    plants,
    loading,
    addPlant,
    updatePlant,
    deletePlant
  };
};
