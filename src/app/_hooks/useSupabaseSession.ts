import { supabase } from "@/utils/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export const useSupabaseSession = () => {
  // undefind: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncSession = (session: Session | null) => {
      setSession(session);
      setToken(session?.access_token || null);
      setUser(session?.user || null);
      setIsLoading(false);
    };

    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      syncSession(session);
    };

    fetcher();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, isLoading, token, user };
};
