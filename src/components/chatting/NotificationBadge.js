import React from "react";

function NotificationBadge({ count }) {
  if (!count || count <= 0) {
    return null;
  }

  return <span className="notification-badge">{count}</span>;
}

export default NotificationBadge;
