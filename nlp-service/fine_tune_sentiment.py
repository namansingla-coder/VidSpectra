from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
import json

# Load dataset
with open("sentiment_dataset.json") as f:
    data = json.load(f)

dataset = Dataset.from_list(data)

# Load tokenizer and model
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=3)

# Tokenize function
def tokenize(example):
    return tokenizer(example["text"], truncation=True, padding="max_length", max_length=512)

# Tokenize dataset
tokenized = dataset.map(tokenize, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir="./finetuned_sentiment_model",
    per_device_train_batch_size=8,
    num_train_epochs=3,
    save_strategy="epoch",
    logging_dir="./logs",
    logging_steps=50
)

# Trainer
trainer = Trainer(model=model, args=training_args, train_dataset=tokenized)

# Train
trainer.train()

# Save
model.save_pretrained("./finetuned_sentiment_model")
tokenizer.save_pretrained("./finetuned_sentiment_model")
print("✅ Model saved to ./finetuned_sentiment_model")