import pandas as pd
import joblib
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv("dataset.csv")

target = "Thickness_mm"
features = df.drop(columns=[target], errors='ignore')
features = pd.get_dummies(features, drop_first=True)

X = features
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Обучение модели...")
model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

joblib.dump(model, "pipeline_model.pkl")
print("Модель сохранена в pipeline_model.pkl")
joblib.dump(X.columns.tolist(), "train_features.pkl")

importances = model.feature_importances_
indices = np.argsort(importances)[::-1]



y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"MAE: {mae:.2f} мм")
print(f"R²: {r2:.3f}")

print("Feature ranking (по убыванию важности):")
for i in range(len(X.columns)):
    print(f"{i+1}. {X.columns[indices[i]]}: {importances[indices[i]]:.3f}")

plt.figure(figsize=(12,6))
plt.title("Feature Importance")
plt.bar(range(len(X.columns)), importances[indices], color="b", align="center")
plt.xticks(range(len(X.columns)), [X.columns[i] for i in indices], rotation=90)
plt.ylabel("Importance")
plt.show()