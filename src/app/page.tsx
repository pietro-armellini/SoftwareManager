'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  //push to the dashboard
  useEffect(() => {
    router.push("/dashboard")
  }, []);

}
