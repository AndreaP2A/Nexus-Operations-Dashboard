import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '../api/mockData';

export const useServiceData = (shouldFail: boolean = false) => {
  return useQuery({
    queryKey: ['services', shouldFail],
    queryFn: () => fetchServices(shouldFail),
    retry: false, // For demo purposes, fail immediately
    refetchOnWindowFocus: false, // Keep state stable while demoing
  });
};
