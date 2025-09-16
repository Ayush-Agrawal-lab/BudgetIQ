declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    REDIS_URL?: string
    INNGEST_EVENT_KEY?: string
    INNGEST_SIGNING_KEY?: string
  }
}