import sys
import torch
import ctranslate2

print("Python:", sys.executable)
print(f"Torch version: {torch.__version__}")
print(f"CUDA available (Torcah): {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"CUDA device: {torch.cuda.get_device_name(0)}")

try:
    print(f"CTranslate2 CUDA devices: {ctranslate2.get_cuda_device_count()}")
except Exception as e:
    print(f"CTranslate2 check failed: {e}")

print("-" * 30)
print("Config recommendation:")
if torch.cuda.is_available() and ctranslate2.get_cuda_device_count() > 0:
    print("✅ GPU 사용 가능. config.py에서 'cuda'로 설정")
else:
    print("⚠️ GPU 사용 불가. config.py에서 'cpu' 및 'int8'로 설정")
