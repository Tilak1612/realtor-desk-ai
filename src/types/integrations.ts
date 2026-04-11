export type IntegrationConnectionStatus = "connected" | "disconnected";
export type IntegrationSyncStatus = "pending" | "success" | "error";
export type IntegrationConnectionMethod = "oauth" | "api_key" | "webhook" | "smtp";
export type IntegrationSyncDirection = "one_way_in" | "one_way_out" | "two_way";

export interface IntegrationConnection {
  id: string;
  user_id: string;
  tool_slug: string;
  status: IntegrationConnectionStatus;
  credentials_encrypted?: string | null;
  connected_account_label: string | null;
  connection_method: IntegrationConnectionMethod | null;
  sync_direction: IntegrationSyncDirection | null;
  sync_config: Record<string, unknown> | null;
  webhook_token: string | null;
  last_sync_at: string | null;
  last_sync_status: IntegrationSyncStatus | null;
  last_sync_error: string | null;
  last_reauth_email_sent_at?: string | null;
  sync_count_total?: number | null;
}

export interface IntegrationInterest {
  tool_slug: string;
}

export interface IntegrationRequest {
  user_id: string;
  tool_name: string;
  use_case: string | null;
}