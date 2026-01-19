# Evaluation: Gold Standard QA Pairs

This directory contains test data for evaluating the RAG system's performance on accuracy, citation quality, and reasoning.

## Overview
- **Total Test Cases**: 5
- **Target Success Rate**: >80% (4/5)
- **Metrics**: Accuracy, Citation Correctness, Recall, Precision

---

## Test Case 1: Factual Recall (Exact Match)

### Document
```
The capital of France is Paris. It has a population of 2.2 million in the city proper. 
The city is divided into 20 arrondissements. Paris is home to world-famous monuments like 
the Eiffel Tower and Notre-Dame Cathedral. The city attracts over 25 million tourists annually.
```

### Query
```
What is the population of Paris?
```

### Expected Answer
- **Content**: Should mention "2.2 million" or similar figure
- **Citations**: Should include [1] or similar reference to the population chunk
- **Form**: Direct factual answer

### Acceptance Criteria
- ✓ Answer contains "2.2 million" or "2200000"
- ✓ Citation [1] or [2] is present
- ✓ Citation points to population metadata

### Metric
**Precision**: 1.0 (if exact fact present) or 0.0 (if wrong fact)

---

## Test Case 2: Multi-Chunk Retrieval & Synthesis

### Document
```
Machine learning is a subset of artificial intelligence. It focuses on enabling computers 
to learn from data without being explicitly programmed. Deep learning is a specialized 
subset of machine learning that uses artificial neural networks with multiple layers. 
Both machine learning and deep learning require large datasets to perform effectively. 
Neural networks were inspired by biological neural systems in the brain.
```

### Query
```
How does deep learning relate to machine learning?
```

### Expected Answer
- **Content**: Should explain that deep learning is a subset of ML, mentions neural networks
- **Citations**: Should reference at least 2 chunks (hierarchy + neural networks)
- **Relationships**: Clear connection between the two concepts

### Acceptance Criteria
- ✓ Answer mentions "deep learning is ... subset" or similar hierarchy
- ✓ Answer mentions "neural networks"
- ✓ At least 2 citations present ([1], [2])
- ✓ Both citations relate to the query

### Metric
**Recall**: Are both key concepts (subset relationship, neural networks) captured?

---

## Test Case 3: No Answer / Out of Scope

### Document
```
Python is a high-level programming language created in 1991 by Guido van Rossum. 
It emphasizes code readability and uses significant whitespace. Python runs on 
Windows, Mac, Linux, and other platforms. The latest version is Python 3.11.
```

### Query
```
When was JavaScript created?
```

### Expected Answer
- **Content**: Should NOT hallucinate JavaScript info; should say "not found" or similar
- **Citations**: None or very few (not making up sources)
- **Tone**: Honest uncertainty

### Acceptance Criteria
- ✓ Answer does NOT contain false JavaScript dates (e.g., "1995")
- ✓ Answer states it cannot find the information
- ✓ No citations from Python document (or very weak confidence)

### Metric
**Precision**: 1.0 (no hallucination) or 0.0 (hallucinated answer)

---

## Test Case 4: Citation Accuracy Verification

### Document
```
[Chunk A] Global climate change is primarily caused by greenhouse gas emissions, 
especially from burning fossil fuels like coal and oil.

[Chunk B] Carbon dioxide (CO2) is the most abundant greenhouse gas, accounting 
for about 75% of human-caused climate warming effects.

[Chunk C] The average global temperature has risen approximately 1.1 degrees 
Celsius since pre-industrial times, with accelerating warming in recent decades.
```

### Query
```
What is the primary cause of climate change?
```

### Expected Answer
- **Content**: Should cite greenhouse gases or emissions
- **Citations**: Should reference Chunk A specifically (primary cause)
- **Precision**: Answer should cite correct source, not C (which is about effects, not causes)

### Acceptance Criteria
- ✓ Answer mentions "greenhouse gases" or "fossil fuels"
- ✓ Citation [1] or similar points to Chunk A
- ✓ Does NOT incorrectly cite Chunk C as the cause

### Metric
**Citation Correctness**: Are the [1], [2] refs mapping to semantically correct chunks?

---

## Test Case 5: Complex Reasoning with Calculation

### Document
```
Our pricing model is as follows: Product A costs $50. Product B is a bundle that 
costs 2x the price of Product A, so Product B costs $100. A flat shipping fee of $10 
is applied to all orders regardless of size. Taxes vary by location but are not included 
in this pricing.
```

### Query
```
What is the total cost of buying both Product A and Product B, including shipping?
```

### Expected Answer
- **Content**: Should calculate $50 + $100 + $10 = $160
- **Citations**: Should cite price chunks and shipping chunk separately
- **Reasoning**: Multi-step arithmetic shown

### Acceptance Criteria
- ✓ Answer contains "160" or "$160"
- ✓ At least 2 citations ([1], [2]) point to different source chunks
- ✓ Explanation shows the calculation steps

### Metric
**Accuracy**: Is the final number correct AND grounded in cited sources?

---

## Evaluation Script

To run automated evaluation:

```bash
npm run test:eval
```

This runs the 5 test cases and outputs:

```
Test Case 1: PASS ✓ (Score: 1.0)
Test Case 2: PASS ✓ (Score: 1.0)
Test Case 3: PASS ✓ (Score: 1.0)
Test Case 4: FAIL ✗ (Score: 0.5) - Wrong citation
Test Case 5: PASS ✓ (Score: 1.0)

Overall: 4/5 PASS (80%) ✓
```

## Manual Testing

1. Upload evaluation documents one at a time
2. Run each query
3. Check answer and citations against criteria
4. Record pass/fail and notes

## Known Issues / Deviations

(Fill in after running evaluation)

---

**Evaluator**: _______________  
**Date**: _______________  
**Result**: ___ / 5 Pass (__%)
