import { AuctionAccessRequestsAPI } from "@/app/api/auction-access-requests/route"
import { apiRequest } from "@/lib/apiFetch"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";

export const useAuctionAccessRequestCreation = () => {
    const queryClient = useQueryClient()
    return useMutation<AuctionAccessRequestsAPI['POST']['response'], AuctionAccessRequestsAPI['POST']['error'], AuctionAccessRequestsAPI['POST']['payload']>({
        mutationFn: apiRequest('/api/auction-access-requests', 'POST'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auction-access-user-data'] })
        }
    })
}

export const useAuctionAccessRequest = () => {
    return useQuery<AuctionAccessRequestsAPI['GET']['response'], AuctionAccessRequestsAPI['GET']['error']>({
        queryKey: ['auction-access-user-data'],
        queryFn: () => {
            return apiRequest('/api/auction-access-requests', 'GET')({})
        }
    })
}

export const useAuctionAccessRequestUpdate = () => {
    const queryClient = useQueryClient()
    return useMutation<AuctionAccessRequestsAPI['PATCH']['response'], AuctionAccessRequestsAPI['PATCH']['error'], AuctionAccessRequestsAPI['PATCH']['payload']>({
        mutationFn: apiRequest('/api/auction-access-requests', 'PATCH'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auction-access-user-data'] })
        }
    })
}

type UseAuctionAccessRequestProps = {
    onError?: (error: any) => void;
};

export const useAuctionAccessDock = ({ onError }: UseAuctionAccessRequestProps = {}) => {
    const [agreement, setAgreement] = useState<File | null>(null);
    const [license, setLicense] = useState<File | null>(null);
    const [auctionAccessNumber, setAuctionAccessNumber] = useState('');
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            if (agreement) formData.append('agreement', agreement);
            if (license) formData.append('license', license);
            if (auctionAccessNumber) formData.append('auctionAccessNumber', auctionAccessNumber);

            const response = await fetch('/api/auction-access-requests/files', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to submit auction access request');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auction-access-user-data'] })
        },
        onError,
    });

    const nextStep = () => {
        mutation.mutate();
    };

    return {
        agreement,
        setAgreement,
        license,
        setLicense,
        auctionAccessNumber,
        setAuctionAccessNumber,
        nextStep,
        ...mutation, // возвращает isLoading, isError, error, data и т.д.
    };
};
