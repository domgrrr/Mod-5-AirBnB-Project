import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSingleSpotFunction, updateSpot } from '../../store/spotsReducer';
import './UpdateSpotForm.css';

const UpdateSpotForm = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
    description: '',
    name: '',
    price: '',
    previewImage: '',
    image1: '',
    image2: '',
    image3: '',
    image4: ''
  });

  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});

  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        const { spot } = await dispatch(fetchSingleSpotFunction(spotId));
        if (!spot) throw new Error('Spot not found');
        
        setFormData({
          country: spot.country || '',
          address: spot.address || '',
          city: spot.city || '',
          state: spot.state || '',
          latitude: spot.lat?.toString() || '',
          longitude: spot.lng?.toString() || '',
          description: spot.description || '',
          name: spot.name || '',
          price: spot.price?.toString() || '',
          previewImage: spot.SpotImages?.find(img => img.preview)?.url || '',
          image1: spot.SpotImages?.filter(img => !img.preview)[0]?.url || '',
          image2: spot.SpotImages?.filter(img => !img.preview)[1]?.url || '',
          image3: spot.SpotImages?.filter(img => !img.preview)[2]?.url || '',
          image4: spot.SpotImages?.filter(img => !img.preview)[3]?.url || ''
        });
      } catch (error) {
        console.error('Error loading spot:', error);
        navigate('/spots/current', { 
          state: { error: 'Failed to load spot details. Please try again.' }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotData();
  }, [dispatch, spotId, navigate]);

  const validateField = (name, value) => {
    let isValid = true;
    let parsedValue;
  
    switch (name) {
      case 'country':
      case 'address':
      case 'city':
      case 'state':
      case 'name':
        isValid = value.trim().length > 0;
        break;
        
      case 'description':
        isValid = value.length >= 30 && value.length <= 1000;
        break;
        
      case 'price':
        parsedValue = parseFloat(value);
        isValid = !isNaN(parsedValue) && parsedValue > 0;
        break;
        
      case 'latitude':
        if (!value) return true;
        parsedValue = parseFloat(value);
        isValid = !isNaN(parsedValue) && parsedValue >= -90 && parsedValue <= 90;
        break;
        
      case 'longitude':
        if (!value) return true;
        parsedValue = parseFloat(value);
        isValid = !isNaN(parsedValue) && parsedValue >= -180 && parsedValue <= 180;
        break;
        
      default:
        isValid = true;
    }
  
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const isValid = validateField(name, value);
    setValidFields(prev => ({
      ...prev,
      [name]: isValid
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['country', 'address', 'city', 'state', 'name', 'price'];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.description.length < 30) {
      newErrors.description = "Description needs 30 or more characters";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    const price = parseFloat(formData.price);
    if (!newErrors.price && (isNaN(price) || price <= 0)) {
      newErrors.price = "Please enter a valid positive price";
    }

    if (formData.latitude && !validateField('latitude', formData.latitude)) {
      newErrors.latitude = "Please enter a valid latitude (-90 to 90)";
    }

    if (formData.longitude && !validateField('longitude', formData.longitude)) {
      newErrors.longitude = "Please enter a valid longitude (-180 to 180)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const updatedSpot = await dispatch(updateSpot(spotId, formData));
        if (!updatedSpot?.id) throw new Error('Failed to update spot');
        navigate(`/spots/${updatedSpot.id}`);
      } catch (err) {
        const errorMessage = err.errors?.[0] || err.message || 'An error occurred. Please try again.';
        setErrors(prev => ({
          ...prev,
          form: errorMessage
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="update-spot-form-container">
      <h1>Update your Spot</h1>
      <form onSubmit={handleSubmit}>
        {errors.form && (
          <div className="error-banner">{errors.form}</div>
        )}

        <section>
          <h2>Where is your place located?</h2>
          <p>Guests will only get your exact address once they booked a reservation.</p>
          
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className={validFields.country ? 'validation-passed' : ''}
          />
          {errors.country && <p className="error">{errors.country}</p>}

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className={validFields.address ? 'validation-passed' : ''}
          />
          {errors.address && <p className="error">{errors.address}</p>}

          <div className="location-inputs">
            <div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className={validFields.city ? 'validation-passed' : ''}
              />
              {errors.city && <p className="error">{errors.city}</p>}
            </div>

            <div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className={validFields.state ? 'validation-passed' : ''}
              />
              {errors.state && <p className="error">{errors.state}</p>}
            </div>
          </div>

          <div className="location-inputs">
            <div>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                className={validFields.latitude ? 'validation-passed' : ''}
              />
              {errors.latitude && <p className="error">{errors.latitude}</p>}
            </div>

            <div>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className={validFields.longitude ? 'validation-passed' : ''}
              />
              {errors.longitude && <p className="error">{errors.longitude}</p>}
            </div>
          </div>
          <span className="optional-label">(Optional)</span>
        </section>

        <section>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please write at least 30 characters"
            className={validFields.description ? 'validation-passed' : ''}
          />
          <p className={`char-count ${formData.description.length >= 30 ? 'success' : 'warning'}`}>
            {formData.description.length < 30
              ? `${30 - formData.description.length} more characters needed`
              : `${formData.description.length} characters (minimum reached)`}
          </p>
          {errors.description && <p className="error">{errors.description}</p>}
        </section>

        <section>
          <h2>Create a title for your spot</h2>
          <p>Catch attention with a spot title that highlights what makes your place special.</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name of your spot"
            className={validFields.name ? 'validation-passed' : ''}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </section>

        <section>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price per night (USD)"
            min="0"
            step="0.01"
            className={validFields.price ? 'validation-passed' : ''}
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </section>

        <section className="image-input-section">
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input
            type="text"
            name="previewImage"
            value={formData.previewImage}
            onChange={handleChange}
            placeholder="Preview Image URL"
          />
          <input
            type="text"
            name="image1"
            value={formData.image1}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <input
            type="text"
            name="image2"
            value={formData.image2}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <input
            type="text"
            name="image3"
            value={formData.image3}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <input
            type="text"
            name="image4"
            value={formData.image4}
            onChange={handleChange}
            placeholder="Image URL"
          />
        </section>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update your Spot'}
        </button>
      </form>
    </div>
  );
};

export default UpdateSpotForm;