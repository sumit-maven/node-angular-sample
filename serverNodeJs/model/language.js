var mongoose = require('mongoose');  
var languageSchema = new mongoose.Schema({  
	language: String,
      lan: String,
	titleName: String,
    signInText: String,
    signUpText: String,
    termsText: String,
    emailEditText: String,
            passEditText: String,
            getStrBtn: String,
            forgotPassText: String,
            registerEmailText: String,
            backBtn: String,
            submitText: String,
            newAccountText: String,
            userNameEditText: String,
            verifyText: String,
            codeEditText: String,
            canclText: String,
            resndText: String,
            newPassText: String,
            newPassEditText: String,
            cnfPassEditText: String,
            okText: String,
            naText: String,
            changeText:String,
            PleaseText: String,
            changeLangText: String,
            askQuesText: String,
            askAnonText: String,
            postAnonText: String,
            shareText: String,
            reportText: String,
            homeTabText: String,
            profTabText: String,
            webTabText: String,
            answered:String,
            grpTabText: String,
            smeTabText: String,
            searchText: String,
            allGrpText: String,
            rcntGrpText: String,
            addBtn: String,
            postBtn: String,
            linkText: String,
            quesText: String,
            feedHintEditText: String,
            creditText: String,
            workText: String,
            educationText: String,
            locationText: String,
            quesProfText: String,
            ansProfText: String,
            editProfText: String,
            signOutText: String,
            langText: String,
            getConnText: String,
            editPhotoText: String,
            statusText: String,
            saveText:String,
            errorNameText: String,
            errorEmailText: String,
            errorPassText: String,
            errorCnfText: String,
            errorStatusHint: String,
            postQuesText: String,
            exitText: String,
            selectOPtText: String,
            chooseGalText: String,
            resPassText: String, 
            statText: String,
            credentialText : String,
            notificationText : String,
            comAnsText : String,
            postText : String,
            errorPssText : String,
            errorVldText : String,
            takePhotoText : String,
            errorQuesText :String,
            createdDate: Date,
            topBadugaText:String,
            relatedQuesText:String,
            recentQuesText:String,
            helpText:String,
            settingsText:String,
            accSeText:String,
            logoutText:String,
            favoGrpText:String,
            postedText:String,
            inteTopText:String,
            relaProText:String,
            feedstext:String,
            socialShareText:String,
            updateText:String,
            moreText:String,
            ansText:String,
            followingText:String,
            followText: String,
            addEmailText:String,
            canAnsText:String,
            peoSeaAnsText:String,
            commentText:String,
            qesViewText:String,
            expChat:String,
            noteLangText:String,
            noQueText:String,
            noAnsText:String,
            noSmeText:String,
            ansPlace:String,
            whoToFollowText:String,
            followText:String,
            followPageText:String,
            viewMoreText:String,
            upvoteText:String,
            peopleFollow:String,
            followGroupText:String,
            headingReport:String,
            hintInsincere:String,
            hintPoorlyWritten:String,
            hintIncorrectTopics:String,
            textHintInsincere:String,
            textPoorlyWritten:String,
            textHintCategory:String,
            textHintFollowing:String,
            textHintFollower:String,
            textIncorrectTopics:String,
            textHintCredential:String,
            textHintEmployment:String,
            textHintEducation:String,
            textHintLocation:String,
            textHintLanguage:String,
            extHintTopic:String,

            //For the headings and buttons
            texthintSeeMore:String,
            texthintSeeLess:String,
            texthintAnswer:String,
            texthintSearch:String,
            texthintShare:String,
            texthintReport:String,
            texthintAnonymously:String,
            texthintComment:String,
            texthintWriteComment:String,
            texthintPost:String,
            texthintSearchGroups:String,
            texthintFollow:String,
            texthintUnFollow:String,
            texthintWelcome:String,
            texthintEnterYourMessage:String,
            texthintFollowers:String,
            texthintFollowing:String,
            texthintDone:String,
            texthintUpdatedSuccessfully:String,
            texthintok:String,
            editTexthintPosition:String,
            editTexthintCompanyName:String,
            editTexthintStartYear:String,
            editTexthintEndYear:String,
            editTexthintSchoolCollage:String,
            editTexthintDegreeType:String,
            editTexthintLocationRequired:String,
            editTexthintAddTopic:String,
            editTexthintGraduationYear:String,
            texthintFollowPeople:String,
            texthintFollowGroup:String,
            texthintGroupCount:String,
            texthintViewAllComment:String,
            texthintGroupName:String,
            textDefault:String,
            selectedLanguage:String,

            textHintLanguageSlider:String,
            textHintHindi:String,
            texgtHintTamil:String,
            
langIcon:String
});
mongoose.model('language', languageSchema,'language');