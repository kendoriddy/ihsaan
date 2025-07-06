# Excel Format for Quiz Questions Upload

## File Format

- **Supported formats**: `.xlsx` and `.xls`
- **First row**: Headers (will be ignored during processing)
- **Data rows**: Start from row 2

## Column Structure

| Column            | Position | Description           | Required | Example                                            |
| ----------------- | -------- | --------------------- | -------- | -------------------------------------------------- |
| Question Text     | A        | The question content  | Yes      | "What is the first letter of the Arabic alphabet?" |
| Option A          | B        | First answer option   | Yes      | "Alif"                                             |
| Option B          | C        | Second answer option  | Yes      | "Baa"                                              |
| Option C          | D        | Third answer option   | No       | "Taa"                                              |
| Option D          | E        | Fourth answer option  | No       | "Thaa"                                             |
| Correct Answer    | F        | Must be A, B, C, or D | Yes      | "A"                                                |
| Course Section ID | G        | Optional section ID   | No       | "123"                                              |

## Validation Rules

1. **Question Text**: Cannot be empty
2. **Options**: At least options A and B must be provided
3. **Correct Answer**: Must be one of: A, B, C, or D (case insensitive)
4. **Course Section ID**: Optional, can be left empty

## Example Data

```
Question Text | Option A | Option B | Option C | Option D | Correct Answer | Course Section ID
What is the first letter of the Arabic alphabet? | Alif | Baa | Taa | Thaa | A |
Which of the following is a vowel in Arabic? | Alif | Baa | Taa | Thaa | A |
How many letters are in the Arabic alphabet? | 26 | 28 | 30 | 32 | B |
```

## Tips

- Use the "Download Template" button to get a properly formatted Excel file
- Preview your questions before uploading to ensure they're formatted correctly
- The system will show validation errors for any rows that don't meet the requirements
- You can upload multiple questions at once using this format
