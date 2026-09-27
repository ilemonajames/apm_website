import { CircleAlert } from "lucide-react";
export function EmptyState({ title, message }: { title: string; message: string }) { return <div className="empty-state" role="status"><CircleAlert aria-hidden="true" /><div><h2>{title}</h2><p>{message}</p></div></div>; }
