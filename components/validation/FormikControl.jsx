import Input from "./Input";
import SelectComponent from "./Select";
import RadioGroup from "./Radio";
import Phone from "./Phone";
import Date from "./Date";
import CheckBox from "./Checkbox";
import DatePickers from "./DatePicker";
import TagInput from "./TagInput";
import ImageUpload from "./ImageUpload";

const FormikControl = ({ control, name, ...rest }) => {
  switch (control) {
    case "input":
      return <Input name={name} {...rest} />;
    case "select":
      return <SelectComponent name={name} {...rest} />;
    case "phone":
      return <Phone name={name} {...rest} />;
    case "radio":
      return <RadioGroup name={name} {...rest} />;
    case "date":
      return <Date name={name} {...rest} />;
    case "checkbox":
      return <CheckBox name={name} {...rest} />;
    case "date":
      return <DatePickers name={name} {...rest} />;
    case "tagInput":
      return <TagInput name={name} {...rest} />;
    case "imageUpload":
      return (
        <ImageUpload
          name={name}
          avatarUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VV7dlZvxOseZJqh0baBIHNre1tzNjcZpXQ&s"
          {...rest}
        />
      );
    default:
      return null;
  }
};

FormikControl.defaultProps = {
  control: "input",
};

export default FormikControl;
