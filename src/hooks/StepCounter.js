import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { Pedometer } from "expo-sensors";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { db, auth } from "../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_FETCH_TASK = "background-fetch";

const useStepCounter = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [stepCount, setStepCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(auth?.currentUser);

  useEffect(() => {
    const checkPedometerAvailability = async () => {
      const result = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(result ? "available" : "unavailable");
    };

    const initializeAuthState = async () => {
      const user = auth?.currentUser;
      if (user) {
        console.log(user);
        setCurrentUser(user);
        await initializeStepCount(user.uid);
      }
    };

    checkPedometerAvailability();
    startPedometer();
    configureBackgroundFetch();
    initializeAuthState();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        setCurrentUser(user);
        initializeStepCount(user.uid);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      Pedometer.stopPedometerUpdates();
      unsubscribe();
    };
  }, []);

  const initializeStepCount = async (uid) => {
    const lastStepCount = await AsyncStorage.getItem(`stepCount-${uid}`);
    const lastUpdatedAt = await AsyncStorage.getItem(`lastUpdatedAt-${uid}`);
    const today = new Date().toISOString().split("T")[0];

    if (lastUpdatedAt !== today) {
      await AsyncStorage.setItem(`stepCount-${uid}`, "0");
      await AsyncStorage.setItem(`lastUpdatedAt-${uid}`, today);
      setStepCount(0);
    } else {
      setStepCount(parseInt(lastStepCount, 10) || 0);
    }
  };

  const startPedometer = () => {
    Pedometer.watchStepCount((result) => {
      updateStepCount(result.steps);
      setStepCount(result.steps);
    });
  };

  const updateStepCount = async (newStepCount) => {
    if (auth?.currentUser) {
      await updateDoc(doc(db, "users", auth?.currentUser.uid), {
        stepcount: newStepCount,
        lastUpdatedAt: new Date(),
      });

      await AsyncStorage.setItem(
        `stepCount-${auth?.currentUser.uid}`,
        newStepCount.toString()
      );
    }
  };

  const configureBackgroundFetch = async () => {
    if (Platform.OS === "ios") {
      await BackgroundFetch.setMinimumIntervalAsync(15 * 60);
    }

    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
      if (auth?.currentUser) {
        const today = new Date().toISOString().split("T")[0];
        const lastUpdatedAt = await AsyncStorage.getItem(
          `lastUpdatedAt-${auth?.currentUser.uid}`
        );

        if (lastUpdatedAt !== today) {
          await AsyncStorage.setItem(`stepCount-${auth?.currentUser.uid}`, "0");
          await AsyncStorage.setItem(
            `lastUpdatedAt-${auth?.currentUser.uid}`,
            today
          );
          setStepCount(0);
          await updateDoc(doc(db, "users", auth?.currentUser.uid), {
            stepcount: 0,
            lastUpdatedAt: new Date(),
          });
        }
      }

      return BackgroundFetch.Result.NewData;
    });

    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 15 * 60, // 15 minutes
    });
  };

  return {
    isPedometerAvailable,
    stepCount,
    currentUser,
  };
};

export default useStepCounter;
