import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";
import axios from "axios";
import endpoints from "@/api/endPoints/endpoints";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.sendotp}`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.message) {
        toast.success(`${response.data?.message}`);
        return response.data;
      }
      return rejectWithValue("No message in response");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message || "Registration failed";
        toast.error(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data: { email: string; otp: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.verifyotp}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data?.message) {
        toast.success(`${response.data?.message}`);
        return response.data;
      }
      return rejectWithValue("No message in response");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message || "Registration failed";
        toast.error(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/register",
  async (
    data: { fullName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.register}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
      if (response.data?.message) {
        toast.success(`${response.data?.message}`);
        return response.data;
      }
      return rejectWithValue("No message in response");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Registration failed";
        toast.error(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.login}`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data?.message) {
        toast.success(`${response.data?.message}`);
        Cookies.set("accessToken", response.data.data.accessToken, {
          expires: 15 / (60 * 24),
        });
        Cookies.set("refreshToken", response.data.data.refreshToken, {
          expires: 7,
        });
        return response.data;
      }
      return rejectWithValue("No message in response");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Registration failed";
        toast.error(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.logout}`,
        { withCredentials: true }
      );
      if (response.data?.message) {
        toast.success(`${response.data?.message}`);
        return response.data;
      }
      return rejectWithValue("No message in response");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Registration failed";
        toast.error(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const forgotSendEmail = createAsyncThunk(
  "auth/forgotSendEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.forgotPasswordSendMail}`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data?.message) {
        toast.success(`${response.data?.message}`);
        return response.data;
      }
      return rejectWithValue("No message in response");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Registration failed";
        toast.error(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const forgotResetPassword = createAsyncThunk(
  "auth/forgotResetPassword",
  async (
    {
      token,
      data,
    }: { token: string; data: { password: string; confirmPassword: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.forgotResetPassword}/${token}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data?.message) {
        toast.success(`${response.data?.message}`);
        return response.data;
      }
      return rejectWithValue("No message in response");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Registration failed";
        toast.error(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const googlesignup = createAsyncThunk(
  "auth/googlesignup",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.googlesignup}?code=${code}`,
        { withCredentials: true }
      );
      if (response.data?.message) {
        toast.success(`${response.data?.message}`);
        Cookies.set("accessToken", response.data.data.accessToken, {
          expires: 15 / (60 * 24),
        });
        Cookies.set("refreshToken", response.data.data.refreshToken, {
          expires: 7,
        });
        return response.data;
      }
      return rejectWithValue("No message in response");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Registration failed";
        toast.error(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const googlesignin = createAsyncThunk(
  "auth/googlesignin",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.googlesignin}?code=${code}`,
        { withCredentials: true }
      );
      if (response.data?.message) {
        toast.success(`${response.data?.message}`);
        Cookies.set("accessToken", response.data.data.accessToken, {
          expires: 15 / (60 * 24),
        });
        Cookies.set("refreshToken", response.data.data.refreshToken, {
          expires: 7,
        });
        return response.data;
      }
      return rejectWithValue("No message in response");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Registration failed";
        toast.error(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const facebooksignup = createAsyncThunk(
  "auth/facebooksignup",
  async (
    data: { name: string; email: string; id: string; avatar: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.facebooksignup}`,
        data,
        { withCredentials: true }
      );
      if (response.data?.message) {
        toast.success(`${response.data?.message}`);
        Cookies.set("accessToken", response.data.data.accessToken, {
          expires: 15 / (60 * 24),
        });
        Cookies.set("refreshToken", response.data.data.refreshToken, {
          expires: 7,
        });
        return response.data;
      }
      return rejectWithValue("No message in response");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Registration failed";
        toast.error(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const facebooksignin = createAsyncThunk(
  "auth/facebooksignin",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.facebooksignin}`,
        { id },
        { withCredentials: true }
      );
      if (response.data?.message) {
        toast.success(`${response.data?.message}`);
        Cookies.set("accessToken", response.data.data.accessToken, {
          expires: 15 / (60 * 24),
        });
        Cookies.set("refreshToken", response.data.data.refreshToken, {
          expires: 7,
        });
        return response.data;
      }
      return rejectWithValue("No message in response");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Registration failed";
        toast.error(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (
    _,
    { rejectWithValue }
  ): Promise<User | undefined | ReturnType<typeof rejectWithValue>> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.user.getuser}`,
        { withCredentials: true }
      );
      if (response?.data?.message) {
        return response?.data?.data;
      }
      return rejectWithValue("No message in response");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Failed to fetch user";
        console.log(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.auth.refreshtoken}`,
        { withCredentials: true }
      );
      if (response?.data?.message) {
        Cookies.set("accessToken", response.data.data.accessToken, {
          expires: 15 / (60 * 24),
        });
        return response?.data;
      }
      return rejectWithValue("No message in response");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Failed to fetch user";
        console.log(msg);
        return rejectWithValue(msg);
      }
      return rejectWithValue("Unknown error");
    }
  }
);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  email: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  email: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetLoading: (state) => {
      state.loading = false;
    },
    setEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
    reSetDetails: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    deleteAccountFromState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state) => {
        state.loading = false;
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signUp.rejected, (state) => {
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(forgotSendEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotSendEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotSendEmail.rejected, (state) => {
        state.loading = false;
      })
      .addCase(forgotResetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotResetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotResetPassword.rejected, (state) => {
        state.loading = false;
      })
      .addCase(googlesignup.pending, (state) => {
        state.loading = true;
      })
      .addCase(googlesignup.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(googlesignup.rejected, (state) => {
        state.loading = false;
      })
      .addCase(googlesignin.pending, (state) => {
        state.loading = true;
      })
      .addCase(googlesignin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(googlesignin.rejected, (state) => {
        state.loading = false;
      })
      .addCase(facebooksignup.pending, (state) => {
        state.loading = true;
      })
      .addCase(facebooksignup.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(facebooksignup.rejected, (state) => {
        state.loading = false;
      })
      .addCase(facebooksignin.pending, (state) => {
        state.loading = true;
      })
      .addCase(facebooksignin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(facebooksignin.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<User | undefined>) => {
          if (action.payload) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
          }
        }
      )
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { resetLoading, setEmail, reSetDetails, deleteAccountFromState } =
  authSlice.actions;
export default authSlice.reducer;
