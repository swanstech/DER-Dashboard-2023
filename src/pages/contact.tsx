import {
    Text,
    Title,
    SimpleGrid,
    TextInput,
    Textarea,
    Button,
    Group,
    ActionIcon,
  } from '@mantine/core';
  import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
  import { ContactIconsList } from '../utils/ContactIcons';
  import classes from '../styles/ContactUs.module.css';
  
  const social = [IconBrandTwitter, IconBrandYoutube, IconBrandInstagram];

export default function ContactUs() {
  const icons = social.map((Icon, index) => (
    <ActionIcon key={index} size={28} className={classes.social} variant="transparent">
      <Icon size="1.4rem" stroke={1.5} />
    </ActionIcon>
  ));

  return (
    <div className={classes.wrapper}>
        <SimpleGrid 
            breakpoints={[
                { minWidth: 0, cols: 1 }, // For extra-small screens
                { minWidth: 'sm', cols: 2 } // For small screens and above
            ]}
            spacing={50}
        >
        <div>
          <Title className={classes.title}>Contact us</Title>
          <Text className={classes.description} mt="sm" mb={30}>
          Swan Foresight's mission is to develop ecosystems using the latest technologies in an ethical and reliable manner. Tell us how we can help you, and we'll be in touch right away.
          </Text>

          <ContactIconsList />

          <Group mt="xl">{icons}</Group>
        </div>
        <div className={classes.form}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            classNames={{ input: classes.input, label: classes.inputLabel }}
          />
          <TextInput
            label="Name"
            placeholder="John Doe"
            mt="md"
            classNames={{ input: classes.input, label: classes.inputLabel }}
          />
          <Textarea
            required
            label="Your message"
            placeholder="I want to secure my DER"
            minRows={4}
            mt="md"
            classNames={{ input: classes.input, label: classes.inputLabel }}
          />

          <Group position="right" mt="md"> {/* Adjusted prop */}
            <Button className={classes.control}>Send message</Button>
          </Group>
        </div>
      </SimpleGrid>
      <div className="footer">
        <p>Powered by <img src="/images/SwansForesight.jpg" width="70px" height="60px"  alt="Swanforesight Logo" /></p>
      </div>
    </div>
  );
}