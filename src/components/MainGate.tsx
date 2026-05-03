import { useMemo } from "react";
import Index from "@/pages/Index";
import UnderConstruction from "@/pages/UnderConstruction";

const PUBLISHED_HOSTS = [
  "premier-broker-sites.lovable.app",
];

const MainGate = () => {
  const isPublished = useMemo(() => {
    const host = window.location.hostname;
    return PUBLISHED_HOSTS.includes(host) || (!host.includes("preview") && !host.includes("localhost"));
  }, []);

  return isPublished ? <UnderConstruction /> : <Index />;
};

export default MainGate;