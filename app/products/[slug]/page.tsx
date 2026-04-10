"use client";
import React, { useState, useEffect, use } from 'react';
import ProductDetail from '@/pages/ProductDetail';
import { companyAPI } from '@/api/apiService';

export default function Product({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await companyAPI.getInfo();
        setCompanyInfo(response.data);
      } catch (err) {
        console.error('Error fetching company info:', err);
      }
    };
    fetchCompanyInfo();
  }, []);

  // Pass slug explicitly if component doesn't read next params directly
  return <ProductDetail companyInfo={companyInfo} currentSlug={resolvedParams.slug} />;
}
