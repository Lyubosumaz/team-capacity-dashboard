"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./config";

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
