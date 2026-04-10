"use client";
import React, { useState, useEffect, use } from 'react';
import EventDetail from '@/pages/EventDetail';
import { companyAPI } from '@/api/apiService';

export default function Event({ params }: { params: Promise<{ slug: string }> }) {
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

  return <EventDetail companyInfo={companyInfo} currentSlug={resolvedParams.slug} />;
}
