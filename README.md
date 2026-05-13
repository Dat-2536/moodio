# Moodio AI: Emotion Recognition Platform using Deep Learning

[![Deployment Status](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://moodio.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-Vue.js%203-4FC08D?style=flat&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![AI Model](https://img.shields.io/badge/Model-ResNet--18-EE4C2C?style=flat&logo=pytorch&logoColor=white)](https://pytorch.org/)

## Overview

Moodio AI is emotion recognition system engineered to provide high-fidelity facial expression analysis. The platform integrates state-of-the-art Deep Learning architectures with a modern web ecosystem to deliver real-time insights through both live video streams and static image processing. 

The system is designed with a focus on performance, scalability, and user experience, featuring a high-tech interface inspired by modern industrial design standards.

## Core Features

- **Real-time Neural Inference**: Low-latency facial emotion analysis optimized for webcam streams.
- **Asynchronous Image Analysis**: Batch processing and high-precision detection for uploaded media files.
- **Concurrent Multi-face Detection**: Robust identification and labeling of multiple subjects within a single frame.
- **Analytical Dashboard**: Comprehensive visualization of emotion trends and system performance metrics.
- **Dynamic Adaptive UI**: Premium glassmorphism interface with automated light/dark mode synchronization.

## Technology Stack

### Frontend Architecture
- **Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Native CSS3 with Glassmorphism and responsive grid systems
- **Animations**: AOS (Animate On Scroll) and customized CSS micro-interactions

### Backend Infrastructure
- **Engine**: FastAPI (Python 3.10+)
- **Integration**: RESTful API architecture with CORS security protocols
- **Environment**: Containerized deployment via Docker

### Artificial Intelligence Pipeline
- **Model Architecture**: ResNet-18 (Residual Network)
- **Framework**: PyTorch
- **Preprocessing**: OpenCV-based face detection and normalization
- **Deployment**: Inference engine optimized for CPU/GPU hybrid environments

## Deployment

The production environment is live and can be accessed at the following URL:

[https://moodio-ai.vercel.app](https://moodio-ai.vercel.app)

## Installation Guide

### Prerequisites
- Python 3.10 or higher
- Node.js 18.x or higher
- NPM or Yarn package manager

### 1. Backend Setup
```bash
cd backend
py -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
py app.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

- `ai/`: Machine learning models, inference scripts, and dataset preprocessing.
- `backend/`: FastAPI application, database logic, and API route definitions.
- `frontend/`: Vue.js components, state management, and asset optimization.
- `space/`: Docker configurations for Hugging Face Space deployment.

## Roadmap

- **Latency Optimization**: Migration to WebSockets for real-time webcam data transmission.
- **Enhanced Accuracy**: Integration of the FER2013 and AffectNet datasets for model fine-tuning.
- **Video Analytics**: Support for emotion tracking across uploaded video files.
- **Persistence Layer**: Implementation of PostgreSQL for long-term emotional data trends.

---
Developed as a significant academic project for the Deep Learning Application curriculum (HW4).

