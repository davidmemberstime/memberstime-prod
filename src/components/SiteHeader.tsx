"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type ClubHit = {
  id: string;
  name: string;
  town?: string | null;
  region?: string | null;
  country?: string | null;
  tier: "Curated" | "Prestigious" | string;
};

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ClubHit[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Use ONE wrapper ref for both desktop+mobile by sharing a single ref
  const wrapperRef = use
