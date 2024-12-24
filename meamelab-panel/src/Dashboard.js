import React, { useEffect, useState } from "react";
import {
  getWalletDetails,
  rechargeWallet,
  redeemWallet,
} from "./services/walletService";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const WalletDashboard = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const [actionError, setActionError] = useState(null);

  const fetchWallet = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.token;
      const walletData = await getWalletDetails(token);
      setWallet(walletData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch wallet details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const validateAmount = (amount, type) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      return "Please enter a valid amount greater than zero.";
    }

    if (type === "redeem" && wallet.balance < amount) {
      return "Insufficient balance for redemption.";
    }

    return null;
  };

  const handleRecharge = async () => {
    const validationError = validateAmount(amount, "recharge");
    if (validationError) {
      setActionError(validationError);
      return;
    }

    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.token;
      const response = await rechargeWallet(token, parseFloat(amount));
      setWallet(response);
      setAmount("");
      setActionError(null);
    } catch (err) {
      console.error(err);
      setActionError("Failed to recharge wallet");
    }
  };

  const handleRedeem = async () => {
    const validationError = validateAmount(amount, "redeem");
    if (validationError) {
      setActionError(validationError);
      return;
    }

    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.token;
      const response = await redeemWallet(token, parseFloat(amount));
      setWallet(response);
      setAmount("");
      setActionError(null);
    } catch (err) {
      console.error(err);
      setActionError("Failed to redeem wallet");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto", mt: 4 }}>
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Wallet Dashboard
          </Typography>
          <Typography variant="h5" align="center" color="primary">
            Balance: ₹{wallet.balance}
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add or Redeem Funds
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={!!actionError}
                helperText={actionError}
              />
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              justifyContent="space-around"
              alignItems="center"
              sx={{
                mt: 2, // Margin at the top
                gap: 2, // Space between buttons
              }}
            >
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<AddCircleOutlineIcon />}
                sx={{
                  backgroundColor: "#4caf50",
                  padding: "10px 20px",
                  "&:hover": {
                    backgroundColor: "#45a049",
                  },
                }}
                onClick={handleRecharge}
              >
                Recharge
              </Button>
              <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<RemoveCircleOutlineIcon />}
                sx={{
                  backgroundColor: "#f44336",
                  padding: "10px 20px",
                  "&:hover": {
                    backgroundColor: "#e53935",
                  },
                }}
                onClick={handleRedeem}
              >
                Redeem
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WalletDashboard;
