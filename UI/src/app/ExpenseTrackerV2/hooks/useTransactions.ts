// // hooks/useTransactions.ts
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//     transactionsApi,
//     type CreateTransactionData,
// } from "../services/endpoints/transactions";

// export const useTransactions = (page: number = 1) => {
//     return useQuery({
//         queryKey: ["transactions", page],
//         queryFn: () => transactionsApi.getTransactions(page),
//         staleTime: 5 * 60 * 1000, // 5 minutes
//     });
// };

// export const useTransactionStats = () => {
//     return useQuery({
//         queryKey: ["stats"],
//         queryFn: transactionsApi.getStats,
//         staleTime: 2 * 60 * 1000, // 2 minutes
//     });
// };

// export const useCreateTransaction = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: (data: CreateTransactionData) =>
//             transactionsApi.createTransaction(data),
//         onSuccess: () => {
//             // Invalidate and refetch transactions and stats
//             queryClient.invalidateQueries({ queryKey: ["transactions"] });
//             queryClient.invalidateQueries({ queryKey: ["stats"] });
//         },
//     });
// };

// export const useUpdateTransaction = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: ({
//             id,
//             data,
//         }: {
//             id: number;
//             data: Partial<CreateTransactionData>;
//         }) => transactionsApi.updateTransaction(id, data),
//         onSuccess: (_, variables) => {
//             queryClient.invalidateQueries({ queryKey: ["transactions"] });
//             queryClient.invalidateQueries({ queryKey: ["stats"] });
//         },
//     });
// };

// export const useDeleteTransaction = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: (id: number) => transactionsApi.deleteTransaction(id),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["transactions"] });
//             queryClient.invalidateQueries({ queryKey: ["stats"] });
//         },
//     });
// };
