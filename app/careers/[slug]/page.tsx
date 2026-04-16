"use client";
import React, { useState, useEffect, use } from 'react';
import CareerDetail from '@/components/legacy/CareerDetail';
import { companyAPI } from '@/api/apiService';

export default function Career({ params }: { params: Promise<{ slug: string }> }) {
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

  return <CareerDetail companyInfo={companyInfo} currentSlug={resolvedParams.slug} />;
}
