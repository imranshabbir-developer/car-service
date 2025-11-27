'use client';

import { useState, useEffect } from 'react';
import DynamicSpecialSection from './DynamicSpecialSection';
import { API_BASE_URL } from '@/config/api';

export default function DynamicSpecialSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const url = `${API_BASE_URL}/special-sections?active=true`;
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`Failed to fetch special sections: ${response.status} ${response.statusText}`);
          console.error('API URL:', url);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        
        if (data.success && data.data && data.data.sections) {
          // Sort by order
          const sortedSections = data.data.sections.sort((a, b) => 
            (a.order || 0) - (b.order || 0)
          );
          setSections(sortedSections);
        } else {
          console.warn('Special sections response structure unexpected:', data);
        }
      } catch (error) {
        console.error('Error fetching special sections:', error);
        console.error('API URL:', `${API_BASE_URL}/special-sections?active=true`);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
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

