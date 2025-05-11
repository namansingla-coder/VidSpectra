from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
import json

# Load your dataset
with open("sentiment_dataset.json") as f:
    data = json.load(f)

# Create HuggingFace dataset
dataset = Dataset.from_list(data)

# Tokenizer and model
model_name = "distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=3)

# Tokenize text
def preprocess(examples):
    return tokenizer(examples["text"], padding=True, truncation=True)

tokenized_dataset = dataset.map(preprocess, batched=True)

# Training config
training_args = TrainingArguments(
    output_dir="./finetuned_sentiment_model",
    per_device_train_batch_size=8,
    num_train_epochs=3,
    logging_dir='./logs',
    save_strategy="epoch",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
)

trainer.train()
trainer.save_model("./finetuned_sentiment_model")
tokenizer.save_pretrained("./finetuned_sentiment_model")