import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# Setup
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

# Load model
def load_model(checkpoint_path):
    model = models.resnet18(weights=None)
    model.fc = nn.Sequential(
        nn.Dropout(p=0.5),
        nn.Linear(512, 256),
        nn.ReLU(),
        nn.BatchNorm1d(256),
        nn.Dropout(p=0.3),
        nn.Linear(256, 7)
    )
    model.load_state_dict(torch.load(checkpoint_path, map_location=DEVICE))
    model.eval()
    return model.to(DEVICE)

# Predict 1 ảnh
def predict(model, img_input):
    transform = transforms.Compose([
        transforms.Grayscale(num_output_channels=3),
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225]),
    ])
    
    if isinstance(img_input, str):
        img = Image.open(img_input)
    else:
        img = img_input # Assuming it's already a PIL Image
        
    tensor = transform(img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        output = model(tensor)
        
        # Apply Softmax with Temperature (T=0.8) to sharpen probabilities
        # This makes the top emotion more prominent/definitive for the user
        temperature = 0.8
        probs = torch.softmax(output / temperature, dim=1)[0]
        
        pred = probs.argmax().item()

    return {
        'emotion': emotions[pred],
        'confidence': round(probs[pred].item() * 100, 2),
        'all_probs': {e: round(probs[i].item() * 100, 2)
                      for i, e in enumerate(emotions)}
    }

# Ví dụ sử dụng
if __name__ == '__main__':
    model = load_model('best_model_final.pth')
    result = predict(model, 'face.jpg')
    print(result)
    # Output mẫu:
    # {'emotion': 'happy', 'confidence': 92.3,
    #  'all_probs': {'angry': 1.2, 'disgust': 0.5, ..., 'happy': 92.3, ...}}
