const Joi = require('joi');
const randomWords = require('random-words')

// Rule: reference to variables should only be from setters and getters 
class TTT {
    #baseTrainingCharacters = '';
    #charSet = '';
    #originalCharSetLength = 0;
    #originalGeneratedCharSet = ''
    #errorCharPositions = []
    #desiredGenerator = 0;
    #previousInputError = false;
    shakeErrorSeconds = 0.3;


    #setCharSet(charSet, setBasedOnTrainingCharacters = false) {
        this.#charSet = charSet;
        if (setBasedOnTrainingCharacters) {
            this.#originalCharSetLength = charSet.length;
        }
    }

    getErrorCharPositions() {
        return this.#errorCharPositions;
    }

    getOriginalCharSetLength() {
        return this.#originalCharSetLength;
    }

    getTrainingCharacters() {
        return this.#baseTrainingCharacters;
    }

    getCharSet() {
        return this.#charSet;
    }

    getFirstLetter() {
        return this.#charSet.charAt(0);
    }

    #validateTrainingCharacters(trainingCharacters) {
        return Joi.string().min(1).max(100).required().validate(trainingCharacters);
    }

    getEliminationPercentage() {
        const result = (this.getOriginalAndCurrentCharSetDiff()) / this.getOriginalCharSetLength();
        return result * 100;
    }

    #generateCharSetDefault(trainingCharacters, sequenceLevel = 2) {
        // TODO implement sequenceLevel
        let result = '';

        const { error } = this.#validateTrainingCharacters(trainingCharacters);
        if (error) return result;

        for (let outerPtr = 0; outerPtr < trainingCharacters.length; outerPtr++) {
            const outerChar = trainingCharacters[outerPtr];

            for (let innerPtr = 0; innerPtr < trainingCharacters.length; innerPtr++) {
                const innerChar = trainingCharacters[innerPtr];

                result += outerChar + innerChar;
            }
        }

        return result;
    }

    #generateCharSetEqualSpreading(trainingChars) {
        let result = '';

        const { error } = this.#validateTrainingCharacters(trainingChars);
        if (error) return result;

        let resultArr = [];
        for (let outerPtr = 0; outerPtr < trainingChars.length; outerPtr++) {
            const outerChar = trainingChars[outerPtr];

            for (let innerPtr = 0; innerPtr < trainingChars.length; innerPtr++) {
                const innerChar = trainingChars[innerPtr];
                const combinedChar = outerChar + innerChar;

                resultArr[trainingChars.length * innerPtr + outerPtr] = combinedChar;
            }
        }
        result = resultArr.join('');

        return result;
    }

    #generateCharSetLPicking(trainingChars) {
        let result = '';

        const { error } = this.#validateTrainingCharacters(trainingChars);
        if (error) return result;

        let resultArr = [];
        for (let outerPtr = 0; outerPtr < trainingChars.length; outerPtr++) {
            const outerChar = trainingChars[outerPtr];

            for (let innerPtr = 0; innerPtr < trainingChars.length; innerPtr++) {
                const innerChar = trainingChars[innerPtr];
                const combinedChar = outerChar + innerChar;

                let trainingCharLengthSqrd = trainingChars.length * trainingChars.length;

                let targetIdx = outerPtr + (trainingChars.length * innerPtr) + (trainingChars.length * outerPtr);
                targetIdx = (targetIdx > trainingCharLengthSqrd) ? (targetIdx - trainingCharLengthSqrd) : targetIdx;

                resultArr[targetIdx] = combinedChar;
            }
        }
        result = resultArr.join('');

        return result;
    }

    #generateCharSetRandomWords() {
        let res = randomWords({
            exactly: 100,
            join: ' ',
            formatter: (word) => {
                if (word.match(new RegExp(`^[${this.getTrainingCharacters()}]*$`))) {
                    return word;
                }
                return '';
            }
        });

        return res.split(/ +/).join(' ').trim();
    }

    #generateCharset(trainingCharacters, charSetGenerator) {
        let newCharSet = '';

        switch (charSetGenerator) {
            case 1:
                newCharSet = this.#generateCharSetEqualSpreading(this.#baseTrainingCharacters);
                break;
            case 2:
                newCharSet = this.#generateCharSetLPicking(this.#baseTrainingCharacters);
                break;
            case 3:
                newCharSet = this.#generateCharSetRandomWords(this.#baseTrainingCharacters);
                break;
            default:
                newCharSet = this.#generateCharSetDefault(this.#baseTrainingCharacters);
        }

        // Update originalGeneratedCharSet
        this.#originalGeneratedCharSet = newCharSet;
        return newCharSet;
    }

    setTrainingCharacters(trainingCharacters, charSetGenerator = 0) {
        const { error } = this.#validateTrainingCharacters(trainingCharacters);

        if (!error) {
            //Refresh error positions
            this.#errorCharPositions = [];

            // Update desiredGenerator property
            this.#desiredGenerator = charSetGenerator;

            // Set new charSet
            this.#baseTrainingCharacters = trainingCharacters;
            let newCharSet = '';

            newCharSet = this.#generateCharset(trainingCharacters, charSetGenerator);

            this.#setCharSet(newCharSet, true);
        } else {
            // return new Error
            this.#setCharSet('', true);
            console.info(error.message)
        }

        return this.#charSet;
    }

    eliminateFirstLetter(char, useStrictMode = false) {
        const { error } = Joi.string().min(1).max(1).validate(char);

        if (!error) {
            // Eliminate first letter from character set
            const firstLetterMatch = char === this.#charSet.charAt(0);
            if (firstLetterMatch && this.getCharSet().length > 0) {
                this.#charSet = this.#charSet.slice(1);
                this.#previousInputError = false;
                return true;
            } else {
                this.#getAndStoreErrorPosition(this.getOriginalCharSetLength(), this.getCharSet().length || 0);
                // if (useStrictMode) this.#resetCharSetHalfway();
                if (useStrictMode && !!!this.#previousInputError) this.#returnSomeCharSet(5);
                this.#previousInputError = true;
                return false;
            }
        } else {
            // if (useStrictMode) this.#resetCharSetHalfway();
            return false;
        }
    }

    getOriginalAndCurrentCharSetDiff() {
        return this.getOriginalCharSetLength() - this.getCharSet().length
    }

    #returnSomeCharSet(howMuchToReturn) {
        let newCharSet = this.#originalGeneratedCharSet;

        let startIdxToReturn = this.getOriginalAndCurrentCharSetDiff() - howMuchToReturn;

        startIdxToReturn = startIdxToReturn >= 0 ? startIdxToReturn : 0

        newCharSet = newCharSet.slice(startIdxToReturn);

        this.#setCharSet(newCharSet);
    }

    #resetCharSetHalfway(progressDivider = 2) {
        const currentPercentage = this.getEliminationPercentage();
        const currentPercentageInCharNumber = Math.round(currentPercentage / 100 * this.getOriginalCharSetLength());

        let newCharSet = this.#originalGeneratedCharSet;
        // let newCharSet = this.#generateCharset(this.getTrainingCharacters(), this.#desiredGenerator);

        if (newCharSet.length > 0) {
            newCharSet = newCharSet.slice(Math.floor(currentPercentageInCharNumber / progressDivider));
        }

        this.#setCharSet(newCharSet);
    }

    #getAndStoreErrorPosition(originalCharSetLength, currentCharSetLength) {
        const errorPosition = originalCharSetLength - currentCharSetLength;

        // Update error position
        this.#errorCharPositions.push(errorPosition);

        // Remove duplicate values
        this.#errorCharPositions = [...new Set(this.#errorCharPositions)];
    }
}

export default new TTT();