"use client";
import React, { useState, useEffect, use } from 'react';
import NewsDetail from '@/components/legacy/NewsDetail';
import { companyAPI } from '@/api/apiService';

export default function News({ params }: { params: Promise<{ slug: string }> }) {
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

  return <NewsDetail companyInfo={companyInfo} currentSlug={resolvedParams.slug} />;
}
