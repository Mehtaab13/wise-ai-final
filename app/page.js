'use client';
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Navbar from "./components/Navbar";
import myImage from './components/openart-f37951f6-6b23-47be-ac5b-f1c6be527db5.png';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000'
      }
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const handleGetStarted = () => {
    setLoading(true);
    router.push('/generate');
  };

  return (
    <Container 
      maxWidth="100%" 
      sx={{ 
        background: "linear-gradient(135deg, #FFC0CB 0%, #FFF5F7 50%, #FFC0CB 100%)", // Softer gradient from pink to white to pink
        minHeight: "100vh", 
        color: "#5D4037", // Darker brown color for text
        padding: "0", 
        display: "flex", 
        flexDirection: "column",
        mt: 8, // Add margin top to push content below the Navbar
      }}
    >
      <Head>
        <title>InstaWise AI</title>
        <meta name="description" content="Your AI-powered advice bot" />
      </Head>

      <Navbar />

      <Box
        sx={{
          textAlign: 'center',
          my: { xs: 2, md: 4 },
          px: { xs: 2, md: 0 },
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ fontFamily: "'Playfair Display', serif", color: "#B22222", fontSize: { xs: "2rem", md: "3rem" } }}>
          Welcome to InstaWise AI
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Image
            src={myImage}
            alt="InstaWise AI"
            layout="responsive"
            width={200} // Set a standard width
            height={800} // Set a standard height
            style={{ maxWidth: '15%', height: 'auto' }} // Ensure image scales down properly
          />
        </Box>
        
        <Typography variant="h5" gutterBottom sx={{ fontFamily: "'Playfair Display', serif", color: "#B22222", fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
          The easiest way to get advice for any problem you may have!
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            mt: 2, 
            backgroundColor: "#FFB6C1", // Soft pink color for the button
            color: "#5D4037", 
            fontFamily: "'Playfair Display', serif",
            '&:hover': { backgroundColor: "#B22222" } // Coral for hover
          }} 
          onClick={handleGetStarted}
        >
          Get Started!
        </Button>
      </Box>

      <Box sx={{ my: { xs: 4, md: 6 }, textAlign: 'center', px: { xs: 2, md: 0 } }}>
        <Typography variant="h4" gutterBottom sx={{
          fontFamily: "'Playfair Display', serif",
          color: "#B22222",
          fontSize: { xs: "1.75rem", md: "2.5rem" }
        }}>
          Features
        </Typography>
        <Box sx={{
          my: { xs: 4, md: 6 },
          textAlign: 'center',
          px: { xs: 2, md: 50 }, // You might want to increase the horizontal padding here
        }}>
          <Slider {...sliderSettings}>
            <div>
              <Box sx={{
                p: 3,
                border: '1px solid',
                borderColor: "#FFB6C1",
                borderRadius: 2,
                backgroundColor: "#FFB6C1",
                color: "#5D4037",
                textAlign: 'left',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                height: '100%',
                width:'100%',
                m: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: { xs: "1.25rem", md: "1.5rem" },
                      fontWeight: 700,
                      textAlign: 'center', // Ensure text is centered
                      width: '100%' // Take up full width of its container
                    }}>
                      <strong>Easy Text Input</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      textAlign: 'center', // Ensure text is centered
                      width: '100%' // Take up full width of its container
                    }}>
                      Simply input your problem and let our software do the rest. Getting advice has never been easier.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </div>
            <div>
              <Box sx={{
                p: 3,
                border: '1px solid',
                borderColor: "#FFB6C1",
                borderRadius: 2,
                backgroundColor: "#FFB6C1",
                color: "#5D4037",
                textAlign: 'left',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                height: '100%',
                width:'100%',
                m: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: { xs: "1.25rem", md: "1.5rem" },
                      fontWeight: 700,
                      textAlign: 'center', // Ensure text is centered
                      width: '100%' // Take up full width of its container
                    }}>
                      <strong>Smart Advice</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      textAlign: 'center', // Ensure text is centered
                      width: '100%' // Take up full width of its container
                    }}>
                      Our AI intelligently breaks down your problem into concise feedback and advice to help you find a solution.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </div>
            <div>
              <Box sx={{
                p: 3,
                border: '1px solid',
                borderColor: "#FFB6C1",
                borderRadius: 2,
                backgroundColor: "#FFB6C1",
                color: "#5D4037",
                textAlign: 'left',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                height: '100%',
                width:'100%',
                m: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: { xs: "1.25rem", md: "1.5rem" },
                      fontWeight: 700,
                      textAlign: 'center', // Ensure text is centered
                      width: '100%' // Take up full width of its container
                    }}>
                      <strong>Accessible Anywhere</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      textAlign: 'center', // Ensure text is centered
                      width: '100%' // Take up full width of its container
                    }}>
                      Access InstaWise AI from any device, at any time. Solve problems on the go!
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </div>
          </Slider>
        </Box>
      </Box>
    </Container>
  );
}
