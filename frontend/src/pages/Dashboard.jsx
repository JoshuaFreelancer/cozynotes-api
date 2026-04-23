import React from "react";
import { MainLayout } from "../layouts/MainLayout";
import { BentoGrid } from "../components/BentoGrid";

export const Dashboard = () => {
  return (
    <MainLayout>
      {/* I'm wrapping my grid here so it's easy to swap content per page */}
      <div className="space-y-6">
        <BentoGrid />
      </div>
    </MainLayout>
  );
};
