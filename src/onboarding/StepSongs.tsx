import { FieldArray, Formik } from 'formik'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { goToNextStep, goToPreviousStep, setSongs } from '../store/onboardingSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { type SongsFormValues, validateSongsForm } from '../utils/songsValidation'

export function StepSongs() {
  const dispatch = useAppDispatch()
  const savedSongs = useAppSelector((s) => s.onboarding.songs)

  const initialSongs =
    savedSongs.length > 0 ? savedSongs : ['']

  const handleSubmit = (values: SongsFormValues) => {
    const trimmed = values.songs.map((s) => s.trim()).filter(Boolean)
    dispatch(setSongs(trimmed))
    dispatch(goToNextStep())
  }

  return (
    <Formik<SongsFormValues>
      enableReinitialize
      initialValues={{ songs: initialSongs }}
      validate={validateSongsForm}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <form className="form" onSubmit={formik.handleSubmit} noValidate>
          <h2 className="form__heading">Favorite songs</h2>
          <p className="card__hint">Add as many tracks as you like.</p>

          <FieldArray name="songs">
            {(arrayHelpers) => (
              <div className="field-list">
                {formik.values.songs.map((song, index) => (
                  <label key={index} className="field field--row">
                    <span className="field__label">Song {index + 1}</span>
                    <div className="field__controls">
                      <Input
                        name={`songs.${index}`}
                        value={song}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Artist — Title"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => arrayHelpers.remove(index)}
                        disabled={formik.values.songs.length <= 1}
                        aria-label={`Remove song ${index + 1}`}
                      >
                        Remove
                      </Button>
                    </div>
                  </label>
                ))}
                <Button type="button" variant="secondary" onClick={() => arrayHelpers.push('')}>
                  Add another song
                </Button>
              </div>
            )}
          </FieldArray>

          {typeof formik.errors.songs === 'string' ? (
            <p id="songs-form-error" className="form__error" role="alert">
              {formik.errors.songs}
            </p>
          ) : null}

          <div className="form__actions">
            <Button type="button" variant="ghost" onClick={() => dispatch(goToPreviousStep())}>
              Back
            </Button>
            <Button type="submit" variant="primary">
              Next
            </Button>
          </div>
        </form>
      )}
    </Formik>
  )
}
