interface PaymentPlans {
  planName: "Standard" | "Pro" | "Premium";
  slug: string;
  price: 199 | 399 | 499;
  duration: "3 months" | "6 months" | "12 months";
  features: string[];
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export { PaymentPlans };
