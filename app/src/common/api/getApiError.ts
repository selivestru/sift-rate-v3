// import { HTTPError } from "ky";

// export type ApiError = {
//   message: string;
//   fieldErrors?: Record<string, string>;
//   status?: number;
// };

// export async function getApiError(err: unknown): Promise<ApiError> {
//   if (err instanceof HTTPError) {
//     try {
//       const data = (await err.response.json()) as {
//         message?: string;
//         errors?: Record<string, string>;
//       };
//       return {
//         message: data.message ?? "Something went wrong",
//         fieldErrors: data.errors,
//         status: err.response.status,
//       };
//     } catch {
//       return {
//         message: "Something went wrong",
//         status: err.response.status,
//       };
//     }
//   }

//   if (err instanceof TypeError) {
//     return { message: "No internet connection" };
//   }

//   return { message: "Something went wrong" };
// }
