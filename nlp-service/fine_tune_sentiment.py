from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
import json

with open("sentiment_dataset.json") as f:
    data = json.load(f)

dataset = Dataset.from_list(data)

model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=3)

def tokenize(example):
    return tokenizer(example["text"], truncation=True, padding=True)

tokenized = dataset.map(tokenize, batched=True)

training_args = TrainingArguments(
    output_dir="./finetuned_sentiment_model",
    per_device_train_batch_size=8,
    num_train_epochs=3,
    save_strategy="epoch",
)

trainer = Trainer(model=model, args=training_args, train_dataset=tokenized)
trainer.train()

model.save_pretrained("./finetuned_sentiment_model")
tokenizer.save_pretrained("./finetuned_sentiment_model")
print("✅ Model saved to ./finetuned_sentiment_model")