<Grid item sx={{width: '50%'}}>
                        <Grid item className={classes.bankDetGrid}>       
                            <InputLabel className={classes.inputLabelInfo} sx={{mr: '18px'}}>{'BIC Code'}</InputLabel>
                            <MbTextField className={classes.inputFieldStyle} label={'BIC Code'} value={state.bicCode} onTextFieldChange={onBankNameChange} size="small"/>
                        </Grid>
                        <Grid item className={classes.bankDetGrid}>       
                            <InputLabel className={classes.inputLabelInfo}>{'Bank Name'}</InputLabel>
                            <MbTextField className={classes.inputFieldStyle} label={'Bank Name'} value={state.bankName} onTextFieldChange={onBankNameChange} size="small"/>       
                        </Grid>
                        <Grid item className={classes.bankDetGrid}>       
                            <InputLabel className={classes.inputLabelInfo} sx={{mr: '10px'}}>{'Service Provider'}</InputLabel>
                            <MbDropdown sxStyles={classes.inputFieldStyle} labelName={'Service Provider'} labelValue={state.serviceProvider} 
                            dropdownList={state.serviceProviderList} onTextFieldChange={onBankNameChange} size="small"/>       
                        </Grid>
                        <Grid item className={classes.bankDetGrid}>                    
                            <InputLabel className={classes.inputLabelInfo}>{'Acquire Id'}</InputLabel>
                            <MbTextField className={classes.inputFieldStyle} label={'Acquire Id'} value={state.acquireId} onTextFieldChange={onBankNameChange} size="small"/>
                        </Grid>
                        <Grid item className={classes.bankDetGrid}>       
                            <InputLabel className={classes.inputLabelInfo}>{'Routing No'}</InputLabel>
                            <MbTextField className={classes.inputFieldStyle} label={'Routing No'} value={state.routingNo} onTextFieldChange={onBankNameChange} size="small"/>          
                        </Grid>
                    </Grid> 
					
Problem : Each MbTextField is not properly aligned vertically. For achive the alignment, manually set the marginRight for each Input Label. any other best way for solve the alignment issue
