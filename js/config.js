export const CONFIG = Object.freeze({
  supabaseUrl: "https://tpzcytjbglwzhgxrzzzb.supabase.co",
  supabasePublishableKey: "sb_publishable_7iOboMbIizp5dfqpiaehLg_xRAan-U2",
  adminEmail: "patricia@calirh.com",
  brand: {
    name: "CALI",
    descriptor: "HR FOR BUSINESS",
    email: "patricia@calirh.com",
    whatsapp: "+55 41 98779-1933",
    site: "https://calirh.com",
  },
});

export function functionUrl(name) {
  return `${CONFIG.supabaseUrl}/functions/v1/${name}`;
}
