'use client';

import { useState, useEffect } from 'react';
import DynamicSpecialSection from './DynamicSpecialSection';
import { API_BASE_URL } from '@/config/api';
import { logger } from '@/utils/logger';

export default function DynamicSpecialSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSections = async () => {
      try {
        const url = `${API_BASE_URL}/special-sections?active=true`;
        const response = await fetch(url);
        
        if (!response.ok) {
          logger.error(`Failed to fetch special sections: ${response.status} ${response.statusText}`);
          logger.error('API URL:', url);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        const data = await response.json();
        
        if (isMounted && data?.success && data?.data?.sections && Array.isArray(data.data.sections)) {
          // Filter out invalid sections and sort by order
          const validSections = data.data.sections.filter(
            section => section && section._id && section.isActive !== false
          );
          const sortedSections = validSections.sort((a, b) => 
            (a.order || 0) - (b.order || 0)
          );
          setSections(sortedSections);
        } else if (isMounted) {
          logger.warn('Special sections response structure unexpected:', data);
          setSections([]);
        }
      } catch (error) {
        logger.error('Error fetching special sections:', error);
        if (isMounted) {
          setSections([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSections();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return null; // Don't show anything while loading
  }

  return (
    <>
      {sections.map((section) => (
        <DynamicSpecialSection key={section._id} section={section} />
      ))}
    </>
  );
}

