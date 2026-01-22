"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase/client";
import { signOut } from "@/app/auth/sign-out/actions";

type ClubRow = {
  id: string;
  name: string;
  region: string;
  country:
