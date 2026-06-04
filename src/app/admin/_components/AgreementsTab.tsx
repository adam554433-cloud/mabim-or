"use client";

import { Card } from "./ui";

export default function AgreementsTab() {
  return (
    <Card className="text-center py-12">
      <div className="text-4xl mb-3">📄</div>
      <h3 className="text-lg font-bold text-yellow-400 mb-1">הסכמי משפיענים</h3>
      <p className="text-amber-200/50 text-sm max-w-md mx-auto">
        כאן יתאפשר לנהל ולהכין הסכמים למשפיענים — רשימת משפיענים, תנאים, ויצירת מסמך הסכם
        מוכן להדפסה. בקרוב.
      </p>
    </Card>
  );
}
