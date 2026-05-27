import React from "react";
import { CategoryPageClient } from "../../../components/CategoryPageClient";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  return <CategoryPageClient category={category} />;
}

// Generate static params at compile-time for dynamic router segments optimization
export async function generateStaticParams() {
  return [
    { category: "converters" },
    { category: "encoding" },
    { category: "text" },
    { category: "css" },
    { category: "generators" },
    { category: "fun" },
    { category: "git" },
  ];
}
