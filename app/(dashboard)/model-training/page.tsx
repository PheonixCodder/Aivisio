import ModelTrainingForm from "@/components/dashboard/model-training/forms/ModelTraining";
import React from "react";

const ModelTraining = () => {
  return (
    <section className="container mx-auto w-full flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold mb-2">Train Model</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Train a new model with your own images
      </p>
        <ModelTrainingForm />
    </section>
  );
};

export default ModelTraining;
