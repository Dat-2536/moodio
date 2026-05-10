# AI Model & Integration Audit - EmotionAI (Moodio)

## 1. Overview
This audit was performed to ensure that the frontend descriptions and technical claims match the actual AI model and processing pipeline implemented in the project.

## 2. AI Model Details (Verified)
- **Model File**: `ai/best_model_final.pth`
- **Architecture**: **ResNet-18** (Verified in `ai/inference.py`)
  - The model uses a ResNet-18 backbone.
  - Custom Fully Connected (FC) head: `Dropout(0.5)` -> `Linear(512, 256)` -> `ReLU` -> `BatchNorm1d(256)` -> `Dropout(0.3)` -> `Linear(256, 7)`.
- **Parameter Count**: ~11.7 Million (Standard for ResNet-18). *Frontend previously claimed 25M (ResNet-50).*
- **Emotion Classes**: 7 standard classes.
  - **Labels**: `['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']` (Verified in `ai/inference.py`).
- **Input Specification**:
  - **Size**: `224 x 224` pixels.
  - **Color Mode**: **Grayscale** (converted to 3-channel replicated grayscale). *Frontend previously claimed RGB.*
  - **Normalization**: Mean `[0.485, 0.456, 0.406]`, Std `[0.229, 0.224, 0.225]`.

## 3. Processing Pipeline (Verified)
- **Face Detection**: **None (Simulated/Placeholder)**.
  - The current backend (`backend/main.py`) does not perform real face detection. It returns hard-coded bounding box coordinates for demonstration purposes.
  - *Frontend previously claimed MTCNN detection.*
- **Inference**: Performed on the full input frame or provided image (assuming it contains a centered face).
- **Output Format**:
  - `emotion`: String label.
  - `confidence`: Float (0.0 - 100.0).
  - `all_probs`: Dictionary of labels to probabilities (0.0 - 100.0).

## 4. Backend API Contract
- **Endpoint**: `POST /analyze-image` and `POST /stream-frame`.
- **Response**:
  ```json
  {
    "status": "success",
    "faces": [
      {
        "face_id": 0,
        "emotion": "happy",
        "confidence": 92.3,
        "all_probs": { ... },
        "bounding_box": { "top": 10, "left": 10, "width": 80, "height": 80 }
      }
    ]
  }
  ```
- **Note**: Bounding boxes are in **percentages** of the frame size.

## 5. Mismatches & Fixes
| Feature | Claim in Frontend | Actual in Code | Action Taken |
| :--- | :--- | :--- | :--- |
| Architecture | ResNet-50 (50 layers) | ResNet-18 (18 layers) | Updated all text to ResNet-18. |
| Params | 25 Million | ~11.7 Million | Updated to ~11 Million. |
| Input Mode | 224x224 RGB | 224x224 Grayscale | Updated descriptions to Grayscale. |
| Detection | MTCNN | None (Simulated) | Labeled as "Illustrative/Simulated". |
| Confidence | 0.0 - 1.0 (expected) | 0.0 - 100.0 (returned) | Fixed multiplier logic in frontend. |
| Labels | Mixed Case / Incomplete | Lowercase / Complete (7) | Standardized labels across UI. |

## 6. Uncertainties & Future Work
- **Feature Maps**: The feature maps shown in the Visualize page are **illustrative** (randomly generated or simplified) and do not represent actual activations from the ResNet-18 layers.
- **Bounding Boxes**: Since real face detection is not yet implemented, the bounding boxes are static.
- **Future Integration**: Plan to integrate real MTCNN or MediaPipe face detection in the backend to match the frontend claims.
